Backbone Bootstrap is a Javascript stack based on :
 * `Require.js <http://requirejs.org/>`_
 * `jQuery <http://jquery.com/>`_
 * `Backbone.js <http://documentcloud.github.com/backbone/>`_
 * `Underscore.js <http://documentcloud.github.com/underscore/>`_

It also provides the following additional functionalities, `described here <http://resthub.org/2/backbone-stack.html>`_.

The following inline update have been done :
 * backbone.paginator.js
  * dataType: 'jsonp' -> dataType: 'json' (at 2 different places)
  * firstPage: 0, -> firstPage: 1, (at 2 different places)

Build status on Travis CI:

.. image:: https://secure.travis-ci.org/resthub/resthub-backbone-stack.png
   :alt: Build Status
   :target: http://travis-ci.org/resthub/resthub-backbone-stack