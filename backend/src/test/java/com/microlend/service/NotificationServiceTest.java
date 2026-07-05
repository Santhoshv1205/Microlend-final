package com.microlend.service;

import com.microlend.entity.Notification;
import com.microlend.enums.NotificationCategory;
import com.microlend.enums.NotificationStatus;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.NotificationRepository;
import com.microlend.service.impl.NotificationServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("NotificationService Tests")
class NotificationServiceTest {

    @Mock private NotificationRepository notificationRepository;
    @InjectMocks private NotificationServiceImpl notificationService;

    private Notification unreadNotification;

    @BeforeEach
    void setUp() {
        unreadNotification = Notification.builder()
                .notificationID(1L)
                .userID(1L)
                .message("Your EMI of Rs.2219.92 is due on 2024-05-20.")
                .category(NotificationCategory.REPAYMENT)
                .status(NotificationStatus.UNREAD)
                .build();
    }

    @Test
    @DisplayName("send() - should create UNREAD notification")
    void send_success() {
        when(notificationRepository.save(any())).thenReturn(unreadNotification);

        Notification result = notificationService.send(
                1L, "Your EMI is due.", NotificationCategory.REPAYMENT);

        assertThat(result.getStatus()).isEqualTo(NotificationStatus.UNREAD);
        assertThat(result.getCategory()).isEqualTo(NotificationCategory.REPAYMENT);
    }

    @Test
    @DisplayName("markRead() - status changes from UNREAD to READ")
    void markRead_success() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(unreadNotification));
        when(notificationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Notification result = notificationService.markRead(1L);

        assertThat(result.getStatus()).isEqualTo(NotificationStatus.READ);
    }

    @Test
    @DisplayName("dismiss() - status changes to DISMISSED")
    void dismiss_success() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(unreadNotification));
        when(notificationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Notification result = notificationService.dismiss(1L);

        assertThat(result.getStatus()).isEqualTo(NotificationStatus.DISMISSED);
    }

    @Test
    @DisplayName("markRead() - throws ResourceNotFoundException when not found")
    void markRead_notFound() {
        when(notificationRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> notificationService.markRead(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("getByUser() - returns notifications for user")
    void getByUser_returnsList() {
        when(notificationRepository.findByUserID(1L)).thenReturn(List.of(unreadNotification));

        List<Notification> result = notificationService.getByUser(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUserID()).isEqualTo(1L);
    }

    @Test
    @DisplayName("getUnreadByUser() - returns only UNREAD notifications")
    void getUnreadByUser_onlyUnread() {
        when(notificationRepository.findByUserIDAndStatus(1L, NotificationStatus.UNREAD))
                .thenReturn(List.of(unreadNotification));

        List<Notification> result = notificationService.getUnreadByUser(1L);

        assertThat(result).allMatch(n -> n.getStatus() == NotificationStatus.UNREAD);
    }
}
