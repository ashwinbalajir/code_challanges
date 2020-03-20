public class BinarySearch {
	BST rootNode;

	class BST {
		BST left;
		BST right;
		int data;

		BST(int n) {
			left = null;
			right = null;
			data = n;
		}

	}

	void push(int n) {
		BST node = new BST(n);

		if (rootNode == null) {
			rootNode = node;
		}

		else {

			BST temp = rootNode;

			while (temp != null) {

				if (temp.data > n) {
					if (temp.left == null) {
						temp.left = node;
						break;
					}
					temp = temp.left;
				} else {
					if (temp.right == null) {
						temp.right = node;
						break;
					}

					temp = temp.right;
				}

			}
		}

	}

	void printInorder(BST temp) {
		if (temp == null) {
			return;
		}
		printInorder(temp.right);
		System.out.print(temp.data + " ");
		printInorder(temp.left);

	}

	void printorder() {
		printInorder(rootNode);
	}

	boolean search(int n) {
		BST temp = rootNode;
		while (temp != null) {
			if (temp.data == n) {
				return true;
			} else if (temp.data < n)
				temp = temp.right;
			else if (temp.data > n)
				temp = temp.left;

		}
		return false;
	}

	void deleteKey(int key) {
		rootNode = deleteRec(rootNode, key, true);
	}

	/* A recursive function to insert a new key in BST */
	BST deleteRec(BST root, int key, boolean delete) {
		/* Base Case: If the tree is empty */
		if (root == null) {
			System.out.println(key + " not found");
			return root;
		}

		/* Otherwise, recur down the tree */
		if (key < root.data)
			root.left = deleteRec(root.left, key, true);
		else if (key > root.data)
			root.right = deleteRec(root.right, key, true);

		// if key is same as root's key, then This is the node
		// to be deleted
		else {
			// node with only one child or no child

			// printDeleteMessage(root.data,key);

			if ((root.left == null || root.right == null) && delete) {
				System.out.println(key + " is deleted.");

			}
			if (root.left == null)
				return root.right;
			else if (root.right == null)
				return root.left;

			// node with two children: Get the inorder successor (smallest
			// in the right subtree)
			root.data = minValue(root.right);
			System.out.println(key + " is deleted and replaced with " + root.data);
			// Delete the inorder successor
			root.right = deleteRec(root.right, root.data, false);
			// System.out.println("right datya"+root.data);
		}

		return root;
	}

	int minValue(BST root) {
		int minv = root.data;
		while (root.left != null) {
			minv = root.left.data;
			root = root.left;
		}
		return minv;
	}

	void printDeleteMessage(int a, int b) {
		if (a == b)
			System.out.println(a + " is deleted.");
	}

	public static void main(String[] args) {
		BinarySearch bst = new BinarySearch();

		bst.push(7);
		bst.push(4);
		bst.push(8);

		bst.push(2);
		bst.push(1);
		bst.push(5);

		System.out.println(bst.search(9));
		bst.deleteKey(1);
		bst.printorder();

	}

}
