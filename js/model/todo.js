

define(['riotjs', 'db/storage'], function(riotjs, storage) {
  'use strict';

  function Todo() {
    var self = riot.observable(this);
    var items = {};

    self.initItems = function() {
      items = storage.getItems() ? storage.getItems() : {};
      self.trigger('init');
    };
          
    self.add = function(name) {
      var id = Date.now();
      var item = {
        id: id,
        name: name,
        completed: false
      };
      items[id] = item;
      self.trigger('add', item);
    };

      self.edit = function(id, name) {
          var item = items[id];
          item.name = name;
          self.trigger('edit', item);
      };

      self.remove = function(id) {
          delete items[id];

          self.trigger('remove', id);
      };

      self.removeCompleted = function() {
        self.items('completed').forEach(function(item) {
          item.completed && self.remove(item.id);
        });
      };

      self.toggle = function(id) {
        items[id].completed = !items[id].completed;
        self.trigger('toggle', id);
      };

      self.toggleAll = function(status) {
        self.items().forEach(function(item) {
          item.completed = status;
        });

        self.trigger('toggleAll', status);
      };

      // @param filter: <empty>, id, 'active', 'completed'
      self.items = function(filterState) {
        return Object.keys(items).filter(function(id) {
          return matchFilter(items[id], filterState);
        }).map(function(id) {
          return items[id];
        });
      };

      self.isDone = function(){
          return self.items('active').length == 0;
      };

      // sync database
      self.on('add remove toggle edit toggleAll', function() {
        storage.setItems(items);
      });

      function matchFilter(item, filter) {
        return !filter || filter === 'all' || (filter === 'active' && !item.completed) || (filter === 'completed' && item.completed);
      }
  };

  return new Todo();

});
