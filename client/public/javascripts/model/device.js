acclab.model.device = new Backbone.Model.extend({
});

acclab.collection.device = new Backbone.Collection.extend({
    model: acclab.model.device,

    url: "/1.0/acc/get"
});