/* global ReactMeteorData */
import React, {Component} from 'react';
import reactMixin from 'react-mixin';

import { Todos } from 'collections';
import { ListGroup, ListGroupItem, Glyphicon, Button } from 'react-bootstrap';

import BlazeTemplate from '../BlazeTemplate';

var faker = require('faker');

@reactMixin.decorate(ReactMeteor.Mixin)
@reactMixin.decorate(ReactMeteorData)
export default class TodosComponent extends Component {
  startMeteorSubscriptions() {
    console.log(Meteor.user());
  }
  getMeteorData() {
    return {
      todos: Todos.find().fetch()
    };
  }
  addTodo() {
    Todos.insert({
      title: faker.fake('{{company.catchPhrase}}'),
      done: false
    });
  }
  refresh(todo) {
    Todos.update(todo._id, {
      $set: {
        title: faker.fake('{{company.catchPhrase}}')
      }
    });
  }
  remove(todo) {
    Todos.remove(todo._id);
  }
  switchDone(todo) {
    Todos.update(todo._id, {
      $set: {
        done: !todo.done
      }
    });
  }
  render() {
    const { todos } = this.data;

    return (
      <div>
        <BlazeTemplate template={Template.loginButtons} />
        <hr/>
        <Button onClick={this.addTodo.bind(this)}>Add a Todo</Button>
        <hr/>
        <ListGroup>
          {todos.map(todo=>{
            return (
              <ListGroupItem key={todo._id}>
                {todo.title}
                <Button bsSize="xs" className="pull-right" onClick={this.remove.bind(this, todo)}><Glyphicon glyph="remove"></Glyphicon></Button>
                <Button bsSize="xs" className="pull-right" onClick={this.refresh.bind(this, todo)}><Glyphicon glyph="refresh"></Glyphicon></Button>
                <Button bsSize="xs" bsStyle={todo.done?"success":"default"} className="pull-right" onClick={this.switchDone.bind(this, todo)}><Glyphicon glyph="ok"></Glyphicon></Button>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </div>
    );
  }
}
