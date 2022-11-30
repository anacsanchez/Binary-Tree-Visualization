import { Tree } from "./nodes.js";
import { ArrayVisual } from "./arrayVisual.js";
import { heapify } from "./heap.js";

function reset() {
  d3.selectAll('svg').remove();
}

function createMaxHeap(arr) {
  document.getElementById('instructions').innerHTML = "<p> Rule: The parent's value is always greater than or equal to the values of its children.</p>";
  document.getElementById('visual-title').innerHTML = "Max-Heap Binary Tree And Array";
  heapify(arr);
  const tree = new Tree();
  tree.createBinaryTree(arr);
  const arrayDisplay = new ArrayVisual(arr);
  arrayDisplay.create(2, 30, 50, 50);
}

function createBinaryTreeAndArr(arr) {
  document.querySelector('#visual-title').innerHTML = "Binary Tree And Array";
  document.querySelector('#instructions').innerHTML = "Click a value in the binary tree or array to highlight its corresponding location in the data structure.";
  const tree = new Tree();
  tree.createBinaryTree(arr);
  const arrayDisplay = new ArrayVisual(arr);
  arrayDisplay.create(2, 30, 50, 50);
}

function createBinarySearchTree(arr) {
  document.querySelector('#visual-title').innerHTML = "Binary Search Tree";
  document.querySelector('#instructions').innerHTML = "The input data sorted and arranged into a Binary Search Tree.";
  arr.sort((a, b) => a - b);
  const tree = new Tree();
  tree.createBinarySearchTree(arr);
}

function createDisplay(optionId) {
  const inputArr = getInputArr();
  if (isValidNumArr(inputArr)) {
    reset();
    switch (optionId) {
      case 'binary-tree-unsorted': {
        createBinaryTreeAndArr(inputArr);
        break;
      }
      case 'max-heap': {
        createMaxHeap(inputArr);
        break;
      }
      case 'binary-search-tree': {
        createBinarySearchTree(inputArr);
        break;
      }
      default: {
        console.error(`option ${optionId} not found`);
      }
    }
  }
}

function handleOptionClick(evt) {
  const optionId = evt.target.id;
  const activeOptionEl = document.querySelector("#tree-options .active-option");
  if (optionId !== activeOptionEl.id) {
    activeOptionEl.classList.remove('active-option');
    evt.target.classList.add('active-option');
    createDisplay(optionId);
  }
}

document.querySelector("#binary-tree-unsorted").addEventListener("click", handleOptionClick);
document.querySelector("#max-heap").addEventListener("click", handleOptionClick);
document.querySelector("#binary-search-tree").addEventListener("click", handleOptionClick);
document.querySelector("#array-input").addEventListener("input", function(evt) {
  const activeOptionEl = document.querySelector("#tree-options .active-option");
  createDisplay(activeOptionEl.id);
})

function getInputArr() {
  const inputText = document.getElementById("array-input");
  return inputText.value.trim()
      .replace(/\s/g, "")
      .split(',')
      .map(function(strEl) { return strEl.length ? +strEl : NaN; });
}

function isValidNumArr(arr) {
  return arr.every(function(num) { return !Number.isNaN(num); });
}

//default values
createBinaryTreeAndArr(getInputArr());
