RESThub Backbone stack changelog
================================

This changelog references the major changes (features, important bugs and security fixes) of resthub-spring-stack project.
Some changes break backwards compatibility, check out the UPGRADE section before you upgrade your application.  

To get the full diff between two versions, go to https://github.com/resthub/resthub-backbone-stack/compare/resthub-2.0.0...resthub-2.1.0

2.1.0 version (XX-YY-2013)
--------------------------

Upgrade from 2.0.0
~~~~~~~~~~~~~~~~~~

Following libraries updated and may lead to some minor incompatibility, most significant ones are detailed bellow :
 * Backbone 0.9.2 to 0.9.10 (`Upgrade guide <http://backbonejs.org/#upgrading>`_)
  * View.dispose() has been replaced by View.stopListening()
  * You should use listenTo() and stopListening() instead of on() and off() since they allow automatic event cleanup when the view is destroyed
  * Model validation is now only enforced by default in Model#save and no longer enforced by default upon construction or in Model#set, unless the {validate:true} option is passed.
 * jQuery 1.8.2 to 1.9.1 (`Upgrade guide <http://jquery.com/upgrade-guide/1.9/>`_)
 * Bootstrap 2.1.1 to 2.3 (`Blog post <http://blog.getbootstrap.com/2013/02/07/bootstrap-2-3-released/>`_)
 * Underscore 1.3.3 to 1.4.4 (`Changelog <http://underscorejs.org/#changelog>`_)
 * RequireJS 2.0.6 to 2.1.4 (`Blog posts <http://jrburke.com/tags/requirejs/>`_)


New features and fixes
~~~~~~~~~~~~~~~~~~~~~~

 * Cache buster when using IE in order to avoid lot of bugs caused by IE aggressive caching strategy
 * Fix IE7 and IE8 compatibility
 * Get model validation constraints from server (see resthub/resthub-spring-stack#165) and translate these cosntraints to effective client Backbone Validation constraints.

