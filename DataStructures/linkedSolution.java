
public class linkedSolution {
	Node head;
	Node tail;

	class Node {
		int data;
		Node next;
		Node prev;

		Node(int n) {
			data = n;
			next = null;
			prev = null;
		}
	}

	void push(int n) {
		Node val = new Node(n);
		if (head == null) {
			head = tail = val;
		} else {
			// System.out.println("tail"+tail.data);
			Node temp = head;
			// System.out.println(temp.next);
			while (temp.next != null) {
				temp = temp.next;
			}
			temp.next = val;

			tail = temp.next;
			tail.prev = temp;

			// System.out.println("temp.prev"+tail.prev.data+" temp data:");

		}
	}

	void printList() {
		Node temp = head;
		while (temp != null) {
			// System.out.println("data:" + temp.data + ",prev:");
			// if (temp.data) {
			System.out.println(temp.data);
			// } else {
			// System.out.println("error" + temp.data);

			// }
			temp = temp.next;
		}
	}

	boolean deleteNode(int n) {
		Node temp = head;
		if (temp.data == n) {
			temp = temp.next;
			head = temp;
			tail = (head == null) ? null : tail;
			return true;
		}
		while (temp.next != null) {
			if (temp.next.data == n) {
				temp.next = temp.next.next;
				return true;
			}
			temp = temp.next;
		}
		return false;
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		linkedSolution ls = new linkedSolution();
		ls.push(1);
		ls.push(2);
		ls.push(3);
		ls.push(4);
		ls.push(5);

		// ls.deleteNode(1);
		ls.printList();
	}
}
