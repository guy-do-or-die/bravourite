#! .env/bin/python

import os.path as op

from flask import Flask, render_template
from flask_graphql import GraphQLView

from schema import schema


app = Flask('bravourite',
            template_folder='.',
            static_folder='static')


@app.route('/')
def root():
    return render_template('root.html')


@app.route('/js/<path:path>')
def js(path):
    return app.send_static_file(op.join('js', path))


@app.route('/css/<path:path>')
def css(path):
    return app.send_static_file(op.join('css', path))


@app.route('/img/<path:path>')
def img(path):
    return app.send_static_file(op.join('img', path))


@app.route('/favicon.ico')
def fav():
    return app.send_static_file('favicon.ico')


app.add_url_rule('/api/sets',
                 view_func=GraphQLView.as_view('graphql', schema=schema))


if __name__ == '__main__':
    app.run()
