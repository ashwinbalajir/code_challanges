import java.util.*;
import java.io.*;

public class syntaxCheck {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String[] a = new String[] { "0111", "1111", "1111", "1111" };

		// a=Arrays.stream("0111".split("(?<=([01]))")).toArray();
		int[][] elem = new int[a.length][a[0].length()];
		for (int i = 0; i < a.length; i++) {
			String temp[] = a[i].split("(?<=([01]))");
			System.out.println(temp[0] + " dfdsf " + a[i]);

			for (int j = 0; j < temp.length; j++) {
				// System.out.println("value"+Integer.parseInt(temp[j]));
				elem[i][j] = Integer.parseInt(temp[j]);
			}
		}

	}

}
