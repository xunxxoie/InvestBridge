package com.investbridge.config;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Date;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions customConversions() {
        return new MongoCustomConversions(Arrays.asList(
                new DateToLocalDateTimeConverter(),
                new LocalDateTimeToDateConverter(),
                new StringToLocalDateTimeConverter()
        ));
    }

    private static class DateToLocalDateTimeConverter implements Converter<Date, LocalDateTime> {
        @Override
        public LocalDateTime convert(Date source) {
            return source == null ? null : LocalDateTime.ofInstant(source.toInstant(), ZoneOffset.UTC);
        }
    }

    private static class LocalDateTimeToDateConverter implements Converter<LocalDateTime, Date> {
        @Override
        public Date convert(LocalDateTime source) {
            return source == null ? null : Date.from(source.toInstant(ZoneOffset.UTC));
        }
    }

    private static class StringToLocalDateTimeConverter implements Converter<String, LocalDateTime> {
        @Override
        public LocalDateTime convert(String source) {
            if (source == null) {
                return null;
            }
            if (source.startsWith("ISODate(") && source.endsWith(")")) {
                source = source.substring(8, source.length() - 1);
                if (source.startsWith("'") && source.endsWith("'")) {
                    source = source.substring(1, source.length() - 1);
                }
            }
            return LocalDateTime.parse(source, DateTimeFormatter.ISO_DATE_TIME);
        }
    }
}