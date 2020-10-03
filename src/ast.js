import { keys, union, has } from 'lodash';

const makeNode = (key, type, ancestry, beforeValue, parent, afterValue) => ({
  key,
  type,
  ancestry,
  beforeValue,
  parent,
  afterValue,
});


export default (firstData, secondData) => {
  const iter = (first, second, ancestry = 0, parent = null) => {
    const onlyUniqueKeys = union(keys(first), keys(second));

    return onlyUniqueKeys.flatMap(((key) => {
      if (!has(first, key)) {
        return makeNode(key, 'added', ancestry, second[key], parent);
      }
      if (!has(second, key)) {
        return makeNode(key, 'deleted', ancestry, first[key], parent);
      }

      if (typeof first[key] === 'object' && typeof second[key] === 'object') {
        const children = iter(first[key], second[key], ancestry + 1, key);
        return makeNode(key, 'unchanged', ancestry, children, parent);
      }
      if (first[key] === second[key]) {
        return makeNode(key, 'unchanged', ancestry, first[key], parent);
      }
      return makeNode(key, 'changed', ancestry, second[key], parent, first[key]);
    }));
  };

  const ast = iter(firstData, secondData);
  return ast;
};
