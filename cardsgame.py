import pkg_resources
import requests

from mako.template import Template

from urlparse import urlparse

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String, List
from xblock.fragment import Fragment

import os
import time
import urllib
import urllib2
import base64
from easyprocess import EasyProcess
import random

class CardsgameBlock(XBlock):

    #DATABASE
    current_problem = Integer(help="", default=-1, scope=Scope.user_state)
    score = Integer(help="", default=0, scope=Scope.user_state)
    solved_problem = List(scope=Scope.user_state)
    display_name = String(help="", default="CardGame", scope=Scope.content)

    problem = List(scope=Scope.content)

    all_users = List(scope=Scope.user_state_summary)
    all_scores = List(scope=Scope.user_state_summary)

    wrong_pts = -50;
    correct_pts = 500;
    magic = 250
    #student

    def student_view(self,context):
        #self.reset()
        #html
        html_str = pkg_resources.resource_string(__name__, "static/html/cardsgame.html")
        frag = Fragment(unicode(html_str).format(self=self))
        #css
        css_str = pkg_resources.resource_string(__name__, "static/css/style.css")
        frag.add_css(unicode(css_str))
        
        css_str = pkg_resources.resource_string(__name__, "static/css/cardsgame.css")
        frag.add_css(unicode(css_str))
        #javascript
        js_str = pkg_resources.resource_string(__name__, "static/js/cardsgame.js")
        frag.add_javascript(unicode(js_str))
        frag.initialize_js('main')
        
        return frag
    
    #studio

    def studio_view(self, context):
        #html
        html_str = pkg_resources.resource_string(__name__, "static/html/cardsgame_edit.html")
        #html_str=Template(html_str).render(data_in=self.data_in,data_out=self.data_out)
        frag = Fragment(unicode(html_str).format(self=self))
        #javascript
        js_str = pkg_resources.resource_string(__name__, "static/js/cardsgame_edit.js")
        frag.add_javascript(unicode(js_str))
        frag.initialize_js('main')
        return frag
    
    def get_user_id(self):
        return self.xmodule_runtime.anonymous_student_id

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        return {'result': 'success'}

    @XBlock.json_handler
    def prob_submit(self, data, suffix=''):
        self.problem.append( (data.get('Description'), data.get('options'), data.get('ans')) )
        return {'result': 'success', 'data': self.problem}

    @XBlock.json_handler
    def get_all_prob(self, data, suffix=''):
        return {'data': self.problem}

    @XBlock.json_handler
    def get_rand_prob(self, data, suffix=''):
        probid = int(data.get('probid'))
        if probid == -1:
            probid = random.randint(1, len(self.problem)) - 1
            self.current_problem = probid
        return {'probid': probid, 'prob': self.problem[probid]}

    @XBlock.json_handler
    def checkans(self, data, suffix=''):
        user_ans = data.get('ans')

        if any( int(x) != y for x, y in zip(self.problem[self.current_problem][2], user_ans) ) :
            if not self.current_problem in self.solved_problem:
                self.score += self.wrong_pts
            return  {'result': 'wrong'}

        if not self.current_problem in self.solved_problem:
            self.score += self.correct_pts
            self.solved_problem.append(self.current_problem)
        self.current_problem = -1
        return {'result': 'pass',}

    @XBlock.json_handler
    def checkunsolve(self, data, suffix=''):
        return {'result': self.current_problem}

    @XBlock.json_handler
    def checkallcard(self, data, suffix=''):
        return {'result': self.solved_problem}

    @XBlock.json_handler
    def delete_prob(self, data, suffix=''):
        prob_id = int(data.get('id'))
        self.problem.pop(prob_id)
        return {'result': 'success'}

    @XBlock.json_handler
    def getscore(self, data, suffix=''):
        userid = self.get_user_id()

        if not userid in self.all_users:
            self.all_users.append(userid)
            self.all_scores.append(self.score)

        idx = self.all_users.index(userid)
        self.all_scores[idx] = self.score

        arr = sorted(zip(self.all_users, self.all_scores), lambda x: x[1] * -1)

        return {'id': self.get_user_id(), 'score': self.score, 'users': arr}

    @XBlock.json_handler
    def magicused(self, data, suffix=''):
        if -1 in self.solved_problem:
            return {'result': 'failed'}

        self.solved_problem.append(-1)
        self.score += self.magic

        return {'result': 'success'}
