package com.playhere.event;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.ResolverStyle;
import java.util.Arrays;
import java.util.List;

public class DateParserUtil {

    public static String[] parseDates(String time) {
        if (time == null || time.trim().isEmpty()) return new String[]{"날짜 없음", "날짜 없음"};

        // Step 1: 날짜 형식 표준화 (공백 제거 및 여러 기호 통합)
        String normalizedTime = time.replaceAll("[./]", "-").trim();

        // Step 2: 다양한 구분자로 날짜 분리 (예: "~", " " 포함)
        String[] dateParts = normalizedTime.split("[~\\s]+");

     // Step 3: 날짜 포맷 리스트
        List<DateTimeFormatter> formatters = Arrays.asList(
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("yyyy.MM.dd"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd")
        );

        String startDate = "날짜 없음";
        String endDate = "날짜 없음";

        for (DateTimeFormatter formatter : formatters) {
            try {
                startDate = LocalDate.parse(dateParts[0].trim(), formatter.withResolverStyle(ResolverStyle.LENIENT)).toString();
                if (dateParts.length > 1) {
                    endDate = LocalDate.parse(dateParts[1].trim(), formatter.withResolverStyle(ResolverStyle.LENIENT)).toString();
                } else {
                    endDate = startDate; // 단일 날짜인 경우 시작 & 종료 날짜 동일
                }
                return new String[]{startDate, endDate};
            } catch (Exception ignored) {
                // 예외 발생 시 다음 패턴 시도
            }
        }

        return new String[]{"날짜 형식 오류", "날짜 형식 오류"}; // 변환 실패 시 반환
    }
}
