import java.io.*;
import java.util.*;

public class TestClass {
    static ArrayList<Integer> findIndex(int[] arr, int n) {
        // List<Integer> arrlist = new ArrayList<Integer>;
        ArrayList<Integer> indexes = new ArrayList<>();
        int i = 0;

        while (i < arr.length) {
            if (arr[i] == n) {
                // indexes[j] = i;
                indexes.add(i);
            }
            i++;
        }
        return indexes;
    }

    public static void main(String args[]) throws Exception {
        Scanner in = new Scanner(System.in);
        int city = in.nextInt();
        int routes = in.nextInt();
        int[] cityIndex = new int[routes];
        int[] onewayRoutesV = new int[routes];
        // for (int i = 0; i < city; i++) {
        for (int j = 0; j < routes; j++) {
            cityIndex[j] = in.nextInt();
            onewayRoutesV[j] = in.nextInt();
        }
        // }
        // int[] cityIndex = { 1, 2, 3, 1, 4 };
        // int[] onewayRoutesV = { 2, 3, 1, 4, 5 };

        int count = 0;
        for (int i = 0; i < city; i++) {
            ArrayList<Integer> indexes = findIndex(cityIndex, onewayRoutesV[i]);
            // int j=i;
            for (Integer index : indexes) {
                while (index != -1) {
                    if (cityIndex[i] == onewayRoutesV[index]) {
                        count++;
                        break;
                    }
                    index = findIndex(cityIndex, onewayRoutesV[index]);
                    // if()
                }
            }
            }
        }
        // System.out.println("count" + count);

        System.out.println(city - count);
    }}