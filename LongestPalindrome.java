public class LongestPalindrome {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String s = "ddddddd";
		int i = 0;
		int[] longerArray = new int[] { 0, 1, 1 };

		while (s.length() > i) {
			int gap = 0;
			// System.out.println(i);
			char letter = s.charAt(i);
			int startindex = i;
			int lastindex = s.indexOf(letter, i + 1);
			int temp = i;
			if (s.indexOf(letter, i + 1) != -1) {
				int tlast_index = lastindex;
				String flag = "entry";
				// while(s.indexOf(s.charAt(tlast_index))>-1){
				while (flag == "entry" || flag == "revisit") {
					gap = 1;
					temp = startindex;
					temp++;
					System.out.println("in" + temp + " " + tlast_index + " " + s.indexOf((s.charAt(temp)), temp + 1));
					while (s.indexOf((s.charAt(temp)), temp + 1) != -1 && temp != s.length()
							&& s.indexOf((s.charAt(temp)), temp + 1) < tlast_index) {
						System.out.println("in");

						if ((startindex + tlast_index) % 2 == 0 && temp == ((startindex + tlast_index) / 2)) {
							// System.out.println("break "+gap);
							break;
						}
						// if(flag=="revisit" && )
						// System.out.println("break "+tlast_index+" "+temp);

						if (s.charAt(temp) == s.charAt(tlast_index - gap)) {
							gap++;
							temp++;
						} else {
							break;
						}
					}
					System.out.println("gap b4:" + gap);
					if (!(s.charAt(temp) == s.charAt(tlast_index - gap))) {
						gap = 1;
					}
					if ((startindex + tlast_index) % 2 == 0 && temp == ((startindex + tlast_index) / 2)) {
						gap += gap + 1;
					} else {
						System.out.println("even");
						gap += gap;
					}
					// System.out.println("last "+startindex+" "+gap);
					if (gap > longerArray[0]) {
						System.out.println("gap change " + " " + gap);

						longerArray[0] = gap;
						longerArray[1] = startindex;
						longerArray[2] = tlast_index + 1;

					}
					if (s.indexOf(s.charAt(startindex), tlast_index + 1) > -1) {
						tlast_index = s.indexOf(s.charAt(startindex), tlast_index + 1);
						System.out.println("in" + tlast_index);
						flag = "revisit";

					} else {
						flag = "end";
					}
				}
			}
			// System.out.println(startindex+" "+gap);

			i++;
		}
		// if(s.length()==0){
		// return "";
		// }
		// else if(longerArray[0]<=1){
		// return ""+s.charAt(s.length()-1);
		// }else{
		// return s.substring(longerArray[1],longerArray[1]+longerArray[0]);
		// }
		System.out.println(longerArray[0] + " " + longerArray[1] + " " + longerArray[2] + " ");
	}

}
