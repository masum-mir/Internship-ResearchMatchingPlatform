package com.ewu.matching.service;

import com.ewu.matching.dto.request.BookmarkRequest;
import com.ewu.matching.dto.response.BookmarkResponse;

import java.util.List;

public interface BookmarkService {
    BookmarkResponse add(BookmarkRequest request);
    void remove(Long bookmarkId);
    List<BookmarkResponse> listMine();
}
