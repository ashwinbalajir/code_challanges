//ad
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode head = new ListNode(l1.val + l2.val);
        ListNode l3 = head;
        boolean extra = false;
        if (head.val >= 10) {
            extra = true;
            head.val %= 10;
        }
        ListNode l4 = l3;
        l3 = l3.next;
        l1 = l1.next;
        l2 = l2.next;
        while (l1 != null && l2 != null) {
            l3 = new ListNode(l1.val + l2.val);
            if (extra) {
                l3.val += 1;
                extra = false;
            }
            if (l3.val > 9) {
                extra = true;
                l3.val %= 10;
            }
            System.out.println("l1 " + l3.val + "l2 " + l2.val);

            l3 = l3.next;
            l1 = l1.next;
            l2 = l2.next;

        }
        return l4;
    }
}