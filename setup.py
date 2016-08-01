from setuptools import setup

setup(
    name='xblock-cardsgame',
    version='0.1',
    description='Cardsgame XBlock',
    py_modules=['cardsgame'],
    install_requires=['XBlock'],
    entry_points={
        'xblock.v1': [
            'cardsgame = cardsgame:CardsgameBlock',
        ]
    }
)