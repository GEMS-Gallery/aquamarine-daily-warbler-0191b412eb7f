export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'dueDate' : IDL.Int,
    'isOverdue' : IDL.Bool,
    'category' : IDL.Text,
  });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text, IDL.Text, IDL.Int], [Result_1], []),
    'deleteTask' : IDL.Func([IDL.Nat], [Result], []),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
    'updateTask' : IDL.Func(
        [IDL.Nat, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Int)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
