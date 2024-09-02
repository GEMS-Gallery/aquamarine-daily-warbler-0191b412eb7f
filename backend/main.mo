import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Int "mo:base/Int";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Iter "mo:base/Iter";

actor {
  type Task = {
    id: Nat;
    title: Text;
    category: Text;
    dueDate: Int;
    isOverdue: Bool;
  };

  stable var taskId: Nat = 0;
  stable var taskEntries: [(Nat, Task)] = [];

  var tasks = HashMap.HashMap<Nat, Task>(0, Nat.equal, Nat.hash);

  public query func getTasks() : async [Task] {
    return Iter.toArray(tasks.vals());
  };

  public func addTask(title: Text, category: Text, dueDate: Int) : async Result.Result<Nat, Text> {
    taskId += 1;
    let newTask: Task = {
      id = taskId;
      title = title;
      category = category;
      dueDate = dueDate;
      isOverdue = Time.now() > dueDate;
    };
    tasks.put(taskId, newTask);
    #ok(taskId)
  };

  public func updateTask(id: Nat, title: ?Text, category: ?Text, dueDate: ?Int) : async Result.Result<(), Text> {
    switch (tasks.get(id)) {
      case (null) { #err("Task not found") };
      case (?task) {
        let updatedTask: Task = {
          id = id;
          title = Option.get(title, task.title);
          category = Option.get(category, task.category);
          dueDate = Option.get(dueDate, task.dueDate);
          isOverdue = Time.now() > Option.get(dueDate, task.dueDate);
        };
        tasks.put(id, updatedTask);
        #ok()
      };
    }
  };

  public func deleteTask(id: Nat) : async Result.Result<(), Text> {
    switch (tasks.remove(id)) {
      case (null) { #err("Task not found") };
      case (?_) { #ok() };
    }
  };

  system func preupgrade() {
    taskEntries := Iter.toArray(tasks.entries());
  };

  system func postupgrade() {
    tasks := HashMap.fromIter<Nat, Task>(taskEntries.vals(), 0, Nat.equal, Nat.hash);
    taskEntries := [];
  };
}
