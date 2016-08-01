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

class CardsgameBlock(XBlock):

    #DATABASE

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