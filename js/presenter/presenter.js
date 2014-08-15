define(['riotjs', 'model/todo', 'jquery'], function(riot, todo, $) {
  var $root = $('#todoapp'),
      filterState = null,
      $todoList = $root.find('#todo-list'),
      template = $("#task-template").html(),
      footerTemplate = $("#footer-template").html(),
      ENTER_KEY = 13,
      ESC_KEY = 27;

  $root.on('keypress', '#new-todo', function(event) {
    var value = $(this).val();
    if ((event.which == ENTER_KEY) && value) {
      todo.add(value);
      this.value = '';
    }
  }).on('click', '#toggle-all', function() {
    todo.toggleAll($(this).prop('checked'));
  }).on('click', '.toggle', function() {
    var id = $(this).closest('li').data('task');
    todo.toggle(id);
  }).on('click', '.destroy', function() {
    var id = $(this).closest('li').data('task');
    todo.remove(id);
  }).on('click', '#clear-completed', function() {
    todo.removeCompleted();
  }).on('dblclick', '.todo-task label', function() {
    $(this).focus().closest('li').addClass('editing');
  }).on('blur', '.edit', function() {console.log(3);
    var id = $(this).closest('li').data('task');
    todo.edit(id, $(this).val());
  }).on('keyup', '.edit', function(event) {
    var id;
    switch(event.which) {
      case ENTER_KEY: 
        id = $(this).closest('li').data('task');
        todo.edit(id, $(this).val());
        break;
      case ESC_KEY: 
        $(this).val($(this).closest('li').find('label').text());
        $(this).closest('li').removeClass('editing');
        break;
    }
  })

  riot.route(function(hash) {
    filterState = hash.slice(2);
    todo.trigger('load', filterState);
  });

  todo.on('add remove edit toggle load init toggleAll', reload);
  todo.on('add remove toggle load toggleAll', counts);
  todo.on('toggleAll', toggleAll);
  todo.on('toggle', toggle);
  
  //init data when start page
  todo.initItems();

  function toggle(id) {
    $todoList.find('#task_' + id).toggleClass('completed');
    var listLength = $todoList.find('li').length;
    if (todo.items('completed').length === todo.items().length) {
      $root.find('#toggle-all').prop('checked', true);
    } else {
      $root.find('#toggle-all').prop('checked', false);
    }
  }

  function toggleAll(status) {
    if (status) {
      $todoList.find('li').addClass('completed');
    } else {
      $todoList.find('li').removeClass('completed');
    }

    $todoList.find('input[type=checkbox]').prop('checked', status);
    
  }

  function reload() {
    var items = todo.items(filterState), task;
    $todoList.empty();

    items.forEach(function(item) {
      var $task = $(riot.render(template, item));
      item.completed && $task.addClass('completed');
      $todoList.append($task);
    });
    
    
  }

  function counts() {
    var left = todo.items('active').length,
        completed = todo.items('completed').length,
        footer, footerParam;
    if (left || completed) {
      footerParam = {
        items: left,
        completed: todo.items('completed').length
      };


      footer = riot.render(footerTemplate, footerParam);
      $('#footer').html(footer);
    }
  }
});