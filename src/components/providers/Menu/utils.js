export const toObject = (arry = []) =>
  arry.reduce((accu, i) => ({...accu, [i.id]: i}), {});

export const populate = (arr, sourceEntity, populateEntityFrom) =>
  arr[sourceEntity].map((i) => ({
    ...i,
    [populateEntityFrom]: i[populateEntityFrom].reduce((accu, x) => {
      const entity = arr[populateEntityFrom].find((t) => t.id === x);
      if (entity) {
        accu.push(entity);
      }
      return accu;
    }, []),
  }));

export const populateSubgroups = (arr) =>
  arr.map((i) => ({
    ...i,
    subgroups: i.subgroups.reduce((accu, x) => {
      const entity = arr.find((t) => t.id === x);
      if (entity) {
        accu.push(entity);
      }
      return accu;
    }, []),
  }));

export const sortGroups = (groupData) =>
  groupData.sort((a, b) => {
    const priorityA = a.priority || 0;
    const priorityB = b.priority || 0;
    return priorityB - priorityA;
  });

export const sortNestedEntityByPriority = (arr) =>
  arr.sort((a, b) => {
    const priorityA = a ? a.priority || 0 : 0;
    const priorityB = b ? b.priority || 0 : 0;
    return priorityB - priorityA;
  });
