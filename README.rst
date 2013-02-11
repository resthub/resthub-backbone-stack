Backbone Bootstrap is a Javascript stack based on :
 * `Require.js <http://requirejs.org/>`_
 * `jQuery <http://jquery.com/>`_
 * `Backbone.js <http://documentcloud.github.com/backbone/>`_
 * `Underscore.js <http://documentcloud.github.com/underscore/>`_

It also provides the following additional functionalities, `described here <http://resthub.org/2/backbone-stack.html>`_.

Inline update
=============

The following inline update have been done, be careful when updating.

backbone.paginator.js
---------------------

  * dataType: 'jsonp' -> dataType: 'json' (at 2 different places)
  * firstPage: 0, -> firstPage: 1, (at 2 different places)

async.js
--------

In order to make async.js working fine with require.js, you should comment some line at the top of the file :

.. code-block:: javascript

    //if (typeof module !== 'undefined' && module.exports) {
    //    module.exports = async;
    //}
    //else {
        root.async = async;
    //

Build status on Travis CI:

.. image:: https://secure.travis-ci.org/resthub/resthub-backbone-stack.png
   :alt: Build Status
   :target: http://travis-ci.org/resthub/resthub-backbone-stack