package com.microlend.service;

import com.microlend.dto.request.CentreRequest;
import com.microlend.entity.Centre;
import com.microlend.enums.CentreStatus;
import com.microlend.enums.MeetingDay;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.CentreRepository;
import com.microlend.service.impl.CentreServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CentreService Tests")
class CentreServiceTest{

    @Mock private CentreRepository centreRepository;
    @InjectMocks private CentreServiceImpl centreService;

    private CentreRequest validRequest;
    private Centre savedCentre;

    @BeforeEach
    void setUp() {
        validRequest = new CentreRequest();
        validRequest.setCentreName("Greenwood Village Centre");
        validRequest.setBranchID(1L);
        validRequest.setFieldOfficerID(4L);
        validRequest.setVillage("Greenwood");
        validRequest.setMeetingDay(MeetingDay.TUESDAY);
        validRequest.setMeetingTime(LocalTime.of(10, 0));
        validRequest.setStatus(CentreStatus.ACTIVE);

        savedCentre = Centre.builder()
                .centreID(1L)
                .centreName("Greenwood Village Centre")
                .branchID(1L)
                .fieldOfficerID(4L)
                .village("Greenwood")
                .meetingDay(MeetingDay.TUESDAY)
                .meetingTime(LocalTime.of(10, 0))
                .status(CentreStatus.ACTIVE)
                .build();
    }

    @Test
    @DisplayName("create() - should save centre with ACTIVE status")
    void create_success() {
        when(centreRepository.save(any())).thenReturn(savedCentre);

        Centre result = centreService.create(validRequest);

        assertThat(result.getCentreID()).isEqualTo(1L);
        assertThat(result.getCentreName()).isEqualTo("Greenwood Village Centre");
        assertThat(result.getMeetingDay()).isEqualTo(MeetingDay.TUESDAY);
        assertThat(result.getStatus()).isEqualTo(CentreStatus.ACTIVE);
    }

    @Test
    @DisplayName("create() - should default to ACTIVE when status not provided")
    void create_defaultActiveStatus() {
        validRequest.setStatus(null);
        when(centreRepository.save(any())).thenAnswer(inv -> {
            Centre c = inv.getArgument(0);
            assertThat(c.getStatus()).isEqualTo(CentreStatus.ACTIVE);
            return savedCentre;
        });
        centreService.create(validRequest);
    }

    @Test
    @DisplayName("getAll() - should return list of all centres")
    void getAll_returnsList() {
        when(centreRepository.findAll()).thenReturn(List.of(savedCentre));
        assertThat(centreService.getAll()).hasSize(1);
    }

    @Test
    @DisplayName("getById() - should return centre when found")
    void getById_found() {
        when(centreRepository.findById(1L)).thenReturn(Optional.of(savedCentre));
        Centre result = centreService.getById(1L);
        assertThat(result.getCentreID()).isEqualTo(1L);
    }

    @Test
    @DisplayName("getById() - should throw ResourceNotFoundException when not found")
    void getById_notFound() {
        when(centreRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> centreService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("update() - should update meeting day and time")
    void update_success() {
        validRequest.setMeetingDay(MeetingDay.WEDNESDAY);
        validRequest.setMeetingTime(LocalTime.of(9, 0));
        when(centreRepository.findById(1L)).thenReturn(Optional.of(savedCentre));
        when(centreRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Centre result = centreService.update(1L, validRequest);

        assertThat(result.getMeetingDay()).isEqualTo(MeetingDay.WEDNESDAY);
        assertThat(result.getMeetingTime()).isEqualTo(LocalTime.of(9, 0));
    }
}
