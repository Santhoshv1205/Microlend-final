package com.microlend.service;

import com.microlend.entity.Notification;
import com.microlend.enums.NotificationCategory;

import java.util.List;

public interface NotificationService {

    Notification send(Long userID, String message, NotificationCategory category);

    List<Notification> getByUser(Long userID);

    List<Notification> getUnreadByUser(Long userID);

    Notification markRead(Long id);

    Notification dismiss(Long id);

    List<Notification> getAll();
}