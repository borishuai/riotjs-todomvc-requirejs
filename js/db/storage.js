define(function(){
  var key = 'todo-tasks';

  return {
    setItems: function(items) {
      localStorage.setItem(key, JSON.stringify(items));
    },
    getItems: function(items) {
      return JSON.parse(localStorage.getItem(key));
    }
  };
});
