//Vue.config.silent = true;
//create the vue views, binding data to DOM elements
/*
 * Function to create Vue.js view.
 * It binds together an HTML element with a datasource reactively
 * @param Object myEl An object representing the HTML element to be bound
 */
function createView(myEl) {

    /*
     * Object representing the data model for the view
     * @param Array items An array representing the data to be rendered in the view
     * @param Array pages An array representing the pages for the current datasource url, given pagination parameters
     * @param int limit Represents the database LIMIT parameter for the current page of data
     * @param int offset Represents the database OFFSET parameter for the current page of data
     * @param Array dependencies A list of Vue.js views that depend on the data in  this view, and should be updated if this view is updated
     * @param String url The data URL that delivers the models items
     */
    var myModel = {
        items: [],
        pages: [],
        limit: 10,
        offset: 0,
        dependencies: myEl.dependencies,
        url: myEl.url
    };

    /*
     * Send asyncronous request to the url specified in the model.
     *
     */
    new Ajax.Request(myModel.url, {
            method: 'get',
            onSuccess: function (myData) {
                //update the model with the retrieved data
                console.log("url " + myModel.url);
                var responseData = JSON.parse(myData.responseText);
                myModel.items = responseData.items;
                //get the list of pages and add it to the model
                var pages = pagination.listPages(responseData.count);
                myModel.pages = pages;
            },
            onLoading: function () {
                //show loading indicator
                startWait("progress" + myEl.el);
            },
            onComplete: function () {
                //hide loading indicator
                stopWait("progress" + myEl.el);
            },
            onFailure: function () {

            }
        }
    );
    //create the Vue.js view given the element myEl and the data in myModel, and return the view
    var vueview = new Vue({
        el: "#" + myEl.el,
        data: myModel
    });
    return vueview;
}

/*
* Function to recursively update a view and its dependencies
* @param Object view A vue.js view to be updated
* @param boolean updateDependencies A bool to determine whether dependencies should be updated (default = true)
 */
function updateView(view, updateDependencies) {
    //Default update dependencies to true
    if (updateDependencies === undefined) {
        updateDependencies = true;
    }


    //get the URL from the view and modify it to add the limit and offset for the DB query
    var myUrl = view.url;
    if (view.limit > 0) {
        myUrl += "&limit=" + view.limit
    }
    if (view.offset > 0) {
        myUrl += "&offset=" + view.offset;
    }
    //send asyncronous request
    new Ajax.Request(myUrl, {
            method: 'get',
            onSuccess: function (myData) {
                //retrieve data and update the views model with it
                var responseData = JSON.parse(myData.responseText);
                view.$set("items", responseData.items);
                view.$set("pages", pagination.listPages(responseData.count));


                //update dependencies
                if (updateDependencies == true) {
                    //get the array of dependendant views
                    var viewsToUpdate = view.$get("dependencies");

                    if (viewsToUpdate.length > 0) {
                        for (var i = 0; i < viewsToUpdate.length; i++) {
                            //load the same sub pages for dependant views that are loaded for the root view
                            viewsToUpdate[i].$set("limit", view.limit);
                            viewsToUpdate[i].$set("offset", view.offset);
                            //recursive call
                            updateView(viewsToUpdate[i], viewsToUpdate[i].url);
                        }
                    }
                }
            },
            onLoading: function () {
                startWait("progress" + view.$el.id);
            },
            onComplete: function () {
                stopWait("progress" + view.$el.id);
                view.$emit("updated");
            },
            onFailure: function () {

            }
        }
    );
}
/*
 * Pagination for view JS views
 * @param int itemsPerPage defines how many items go on a page
 * @param function listPages return an array representing the the number of pages given a total number of items and itemsPerPage
 * @param function loadPage Load a specific page of data to a view
 */
var pagination = {
    itemsPerPage: 10,
    listPages: function (numTotal) {
        //round up the number of pages
        var pagenum = Math.ceil(numTotal / this.itemsPerPage);
        var pages = [];

        //loop through the pages and create a page object for each page, having its index and limit
        for (var i = 0; i < pagenum; i++) {
            var index = i + 1;
            var page = {
                index: index,
                limit: index * this.itemsPerPage
            };
            pages.push(page);
        }

        return pages;

    },
    loadPage: function (view, page) {

        //calculate the offset for the DB query
        var offset = page * this.itemsPerPage - this.itemsPerPage;

        //set the new limit and offset to the view
        view.$set("limit", this.itemsPerPage);
        view.$set("offset", offset);

        //triger the view to be updated
        updateView(view, true);
    }
};

/*
 * Function to asyncronously submit a form
 * This is to be used with form.addEventListener()
 * the event gets automatically passed in
 *
 *
 *
 */
function submitForm(event) {
    //get the form
    var theForm = event.currentTarget;
    //get the submit url
    var url = theForm.action;
    //validate the form
    var validates = validateCompleteForm(theForm);

    console.log("validates:" + validates);

    //stop the form event from bubbling up. stops form submit
    event.stopPropagation();
    event.preventDefault();

    if (validates == true) {

        //string holding the final post body
        var pbody = "";
        //loop over form elements
        for (i = 0; i < theForm.elements.length; i++) {
            //one element
            var element = theForm.elements[i];
            //construct post body
            if (element.value != undefined) {
                pbody += "&" + element.name + "=" + element.value;
            }
        }

        //send asyncronous request
        new Ajax.Request(url, {
                method: "POST",
                postBody: pbody,
                onSuccess: function (myData) {
                    if (myData.status == 200) {
                        //update the view belonging to the form
                        updateView(formView, false);
                    }
                },
                onLoading: function () {
                    //show loading indicator
                    startWait("progress" + formView.$el);
                },
                onComplete: function () {
                    //hide loading indicator
                    console.log("added");

                    stopWait("progress" + formView.$el);
                },
                onFailure: function () {
                    console.log("error");
                }
            }
        );

    }
}

/*
 Show loading indicator
 */
function startWait(indic) {

    $(indic).style.display = 'block';
}
/*
 hide loading indicator
 */
function stopWait(indic) {
    $(indic).style.display = 'none';
}