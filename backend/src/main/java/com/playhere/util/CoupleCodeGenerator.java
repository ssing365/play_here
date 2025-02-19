package com.playhere.util;

import java.security.SecureRandom;

public class CoupleCodeGenerator {
	 private static final String CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	 private static final SecureRandom random = new SecureRandom();

	 public static String generateCode() {
		 StringBuilder sb = new StringBuilder(6);
		 for (int i = 0; i<6; i++) {
			 int index = random.nextInt(CHAR_POOL.length());
			 sb.append(CHAR_POOL.charAt(index));
		 }
		 return sb.toString();
	 }
}
