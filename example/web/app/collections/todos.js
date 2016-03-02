const Todos = new Mongo.Collection('todos');

const TodoSchema = new SimpleSchema({
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();  // Prevent user from supplying their own value
            }
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    },
    title: {
        type: String
    },
    done: {
        type: Boolean,
        defaultValue: false
    }
});
Todos.attachSchema(TodoSchema);

const allow = function (userId, doc) {
    return true;
};

Todos.allow({
    'insert': allow,
    'update': allow,
    'remove': allow
});

export default Todos;
