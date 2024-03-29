let swaps = [];
//Helper functions
export function swap(arr, a, b) {
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

export function getParentIndex(childIndex) {
  return Math.floor((childIndex - 1) / 2);
}

export function getLeftChildIndex(index) {
  return 2 * index + 1;
}

export function getRightChildIndex(index) {
  return 2 * index + 2;
}

//make an array into a max-heap
export function heapify(arr) {
  let i;  // Index of next element to be added to the heap
  let k;  // Index of new element as it is being pushed

  for (i = 1; i < arr.length; ++i)
  {
      k = i;
      while (k > 0 && arr[k] > arr[getParentIndex(k)])
      {
          swap(arr, getParentIndex(k), k);
          k = getParentIndex(k);
      }
  }
  return arr;
}

export function reheapifyDown(arr, length) {
  let index = 0;
  let bigChildIndex;
  let isHeap = false;

  //loop keeps going while the array is not a heap and the current element
  //has at least a left child. If leftChild(index) is greater than the length of the array, the index does not have any children
  while (!isHeap && getLeftChildIndex(index) < length) {
    if (getRightChildIndex(index) >= length) {   //no right child
      bigChildIndex = getLeftChildIndex(index);
    }
    else if (arr[getLeftChildIndex(index)] > arr[getRightChildIndex(index)]) { //if left child is the bigger of the two children
      bigChildIndex = getLeftChildIndex(index);
    }
    else {  //then right child is bigger
      bigChildIndex = getRightChildIndex(index)
    }
    //If the larger child's value is bigger than the current(parent) node, swap the values and continue the loop; otherwise it's a heap
    if (arr[index] < arr[bigChildIndex]) {
      swaps.push([index,bigChildIndex]);
      console.log('reheapifying', index, bigChildIndex);
      swap(arr, index, bigChildIndex)
      index = bigChildIndex;
    }
    else {
      isHeap = true;
    }
  }
}

