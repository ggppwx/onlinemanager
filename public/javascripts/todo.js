//create todo 
//$( document ).ready(function() { //when the documents reday 
    // init 
    var counter = 0;

    function initApp(){
        // createTodoNew();
        
        // add handler
        $('.add-todo').on('keypress',function (e) {
          console.log('ddddd');
//          e.preventDefault
          if (e.which == 13) { // if this is enter 
            if($(this).val() != ''){
                var todo = $(this).val();
                $.post(
                    '/todo/add',  
                    {
                        name: 'todo',
                        value: todo,
                    },
                    function(data,status){
                        addTodo(data._id, todo);
                    }
                );
            }else{
                   // some validation
            }
          }
        });


        $( "#todolist" ).sortable({
            handle: ".panel-heading",
            update: function(event, ui){
                var data = $("#todolist").sortable('serialize');
                console.log(data);
                $.post(
                    '/todo/reorder',  
                    {
                        order : data
                    },
                    function(data,status){
                        //alert("Data: " + data + "\nStatus: " + status);
                    }
                );
            }
        });

        $( "#todolist" ).disableSelection();


    }


    //create task 
    function addTodo(id, text){
        var markup = $('<li class="ui-state-default"> \
            <div class="panel panel-default"> \
            <div class="panel-heading"> \
                <h3 class="panel-title"></h3> \
                <a class="close pull-right close-todo" data-effect="fadeOut">×</a> \
            </div> \
            <div class="panel-body" > \
                <div class="editable-item" href="#">'+text+'</div> \
                <div class="editable-processed">'+marked(text)+'</div> \
            </div> \
            </div> \
            </li>');  // this is important !!! to create jquery object


        $('#todolist').append(markup);
        $('.add-todo').val('');

        $(markup).attr('id', 'sort_'+id);

        // x-editable setting 
        $('.editable-item', markup).attr('id', 'todo' + counter); 
        $('.editable-processed', markup).attr('id', 'todo' + counter);

        $('.editable-item', markup).hide();
        $('.editable-item', markup).editable({
            type : 'textarea',
            // tpl: "<textarea rows='15' style='width: 80%'>",
            pk : id,
            emptytext : '',
            inputclass: 'input-large',
            url: '/todo/save',
            rows : 18,
            title : 'Enter Description',
            success: function(response, newValue) {
                console.log('saved');
                // userModel.set('item', newValue); //update backbone model

            }
        });



        // at this time editable-item is not there, we only have form 
        $('.editable-item', markup).on('save', function(e, params){
            e.stopPropagation();
            var markdownText = marked(params.newValue);
            console.log(markdownText);
            $('.editable-processed', markup).html(markdownText);

        });

        // this time editable item is there 
        $('.editable-item', markup).on('hidden', function(e, reason){
            e.stopPropagation();
            $(this).hide();
            $('.editable-processed', markup).show();
        });

        $('.editable-processed', markup).on('click', function(e){
            // show 
            e.stopPropagation();
            $('.editable-item', markup).show();
            $('.editable-item', markup).editable('toggle'); // important make it editable 
            $(this).hide();
        });


        // remove item 
        $('.close-todo', markup).attr('id', 'todo' + counter );
        $('.close-todo', markup).on('click',function(e){
            e.stopPropagation();
            console.log('close');
            console.log(id);
            
            $.post(
                '/todo/remove',  
                {
                    pk: id
                },
                function(data,status){
                    //alert("Data: " + data + "\nStatus: " + status);
                }
            );

            var effect = $(this).data('effect');
            $(this).closest('.panel')[effect]();
            return false;
        });

        counter += 1;

    }



    // mark task as done



    

// });

