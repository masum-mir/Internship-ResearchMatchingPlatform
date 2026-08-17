package com.ewu.matching.service;

import com.ewu.matching.dto.request.CredentialChangeRequestPayload;
import com.ewu.matching.dto.response.CredentialChangeRequestResponse;

import java.util.List;

public interface CredentialChangeService {

    // Applies the change immediately if the current user has self-edit
    // permission enabled; otherwise creates a PENDING request for an admin.
    CredentialChangeRequestResponse submit(CredentialChangeRequestPayload request);

    // The current user's own change requests, newest first.
    List<CredentialChangeRequestResponse> mine();

    // Admin: all requests, optionally filtered by status.
    List<CredentialChangeRequestResponse> list(String status);

    // Admin: approve a pending request, applying the requested change.
    CredentialChangeRequestResponse approve(Long requestId);

    // Admin: reject a pending request without applying it.
    CredentialChangeRequestResponse reject(Long requestId);
}
