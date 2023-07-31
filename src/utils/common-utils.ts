import { OpenmrsObs } from '../api/types';

export function flattenObsList(obsList: OpenmrsObs[]): OpenmrsObs[] {
  const flattenedList: OpenmrsObs[] = [];

  function flatten(obs: OpenmrsObs): void {
    if (!obs.groupMembers || obs.groupMembers.length === 0) {
      flattenedList.push(obs);
    } else {
      obs.groupMembers.forEach(groupMember => {
        flatten(groupMember);
      });
    }
  }
  obsList.forEach(obs => {
    flatten(obs);
  });

  return flattenedList;
}
