import { List } from 'immutable';

const selectSummary = () => (state) => {
  const crews = state.getIn(['summary', 'data'], new List());

  // Move the 'National Rappel Specialist' to the bottom of the list
  // Starting from the end of the list, 'unshift' elements to the beginning of a sorted list (keeping the same order).
  // When the 'National Rappel Specialist' is found, push it to the end of the sorted list,
  // then continue adding elements to the beginning again.
  return crews.reduceRight((accumulator, item) => {
    if (item.get('name') === 'National Rappel Specialist') {
      return accumulator.push(item);
    }
    return accumulator.unshift(item);
  }, new List());
};

export { selectSummary };
