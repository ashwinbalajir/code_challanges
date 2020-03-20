public class leetcode {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String s = "dvdfgd";
		// System.out.println(s.length());
		String current = "";
		// current+=" ";
		int len = 0;
		for (int i = 0; i < s.length(); i++) {
			if (current.indexOf(s.charAt(i)) == -1) {
				current += s.charAt(i);

			} else {
				if (len < current.length()) {
					System.out.println("current" + current + " " + current.length());
					len = current.length();
				}
				if (!(current.charAt(current.length() - 1) == s.charAt(i))) {
					current = current.substring(current.indexOf(s.charAt(i)) + 1, current.length()) + s.charAt(i);

				} else {
					current = s.charAt(i) + "";
				}

			}
		}
		// System.out.println(current);
		if (len < current.length()) {
			len = current.length();
		}
		System.out.println(len);
	}

}
