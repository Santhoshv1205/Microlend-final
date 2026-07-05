package com.microlend.service;

import com.microlend.dto.request.DelinquencyCaseRequest;
import com.microlend.entity.DelinquencyCase;
import com.microlend.enums.DelinquencyAction;
import com.microlend.enums.DelinquencyStatus;
import com.microlend.enums.PARBucket;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.DelinquencyCaseRepository;
import com.microlend.service.impl.DelinquencyServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DelinquencyService Tests")
class DelinquencyServiceTest {

    @Mock private DelinquencyCaseRepository delinquencyRepository;
    @InjectMocks private DelinquencyServiceImpl delinquencyService;

    private DelinquencyCaseRequest validRequest;
    private DelinquencyCase openCase;

    @BeforeEach
    void setUp() {
        validRequest = new DelinquencyCaseRequest();
        validRequest.setLoanAccountID(1L);
        validRequest.setDpd(35);
        validRequest.setParBucket(PARBucket.PAR30);
        validRequest.setAssignedCollectionsOfficerID(5L);
        validRequest.setAction(DelinquencyAction.FIELD_VISIT);
        validRequest.setStatus(DelinquencyStatus.OPEN);

        openCase = DelinquencyCase.builder()
                .delinquencyID(1L)
                .loanAccountID(1L)
                .dpd(35)
                .parBucket(PARBucket.PAR30)
                .assignedCollectionsOfficerID(5L)
                .openedDate(LocalDate.now())
                .action(DelinquencyAction.FIELD_VISIT)
                .status(DelinquencyStatus.OPEN)
                .build();
    }

    @Test
    @DisplayName("create() - should save delinquency case with OPEN status")
    void create_success() {
        when(delinquencyRepository.save(any())).thenReturn(openCase);

        DelinquencyCase result = delinquencyService.create(validRequest);

        assertThat(result.getDelinquencyID()).isEqualTo(1L);
        assertThat(result.getStatus()).isEqualTo(DelinquencyStatus.OPEN);
        assertThat(result.getParBucket()).isEqualTo(PARBucket.PAR30);
        assertThat(result.getDpd()).isEqualTo(35);
    }

    @Test
    @DisplayName("create() - should default to OPEN when status not provided")
    void create_defaultOpenStatus() {
        validRequest.setStatus(null);
        when(delinquencyRepository.save(any())).thenAnswer(inv -> {
            DelinquencyCase dc = inv.getArgument(0);
            assertThat(dc.getStatus()).isEqualTo(DelinquencyStatus.OPEN);
            return openCase;
        });

        delinquencyService.create(validRequest);
    }

    @Test
    @DisplayName("create() - openedDate should be set to today")
    void create_opensDateIsToday() {
        when(delinquencyRepository.save(any())).thenAnswer(inv -> {
            DelinquencyCase dc = inv.getArgument(0);
            assertThat(dc.getOpenedDate()).isEqualTo(LocalDate.now());
            return openCase;
        });

        delinquencyService.create(validRequest);
    }

    @Test
    @DisplayName("update() - should escalate action to LEGAL_NOTICE")
    void update_escalateAction() {
        validRequest.setAction(DelinquencyAction.LEGAL_NOTICE);
        validRequest.setStatus(DelinquencyStatus.IN_PROGRESS);
        validRequest.setDpd(42);
        when(delinquencyRepository.findById(1L)).thenReturn(Optional.of(openCase));
        when(delinquencyRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        DelinquencyCase result = delinquencyService.update(1L, validRequest);

        assertThat(result.getAction()).isEqualTo(DelinquencyAction.LEGAL_NOTICE);
        assertThat(result.getStatus()).isEqualTo(DelinquencyStatus.IN_PROGRESS);
        assertThat(result.getDpd()).isEqualTo(42);
    }

    @Test
    @DisplayName("update() - should mark case RESOLVED when borrower pays")
    void update_resolveCase() {
        validRequest.setStatus(DelinquencyStatus.RESOLVED);
        when(delinquencyRepository.findById(1L)).thenReturn(Optional.of(openCase));
        when(delinquencyRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        DelinquencyCase result = delinquencyService.update(1L, validRequest);

        assertThat(result.getStatus()).isEqualTo(DelinquencyStatus.RESOLVED);
    }

    @Test
    @DisplayName("update() - should throw when case not found")
    void update_notFound_throwsException() {
        when(delinquencyRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> delinquencyService.update(99L, validRequest))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("getByStatus() - should return only OPEN cases")
    void getByStatus_openCases() {
        when(delinquencyRepository.findByStatus(DelinquencyStatus.OPEN))
                .thenReturn(List.of(openCase));

        List<DelinquencyCase> result = delinquencyService.getByStatus(DelinquencyStatus.OPEN);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(DelinquencyStatus.OPEN);
    }

    @Test
    @DisplayName("getByOfficer() - should return cases for assigned officer")
    void getByOfficer_filtered() {
        when(delinquencyRepository.findByAssignedCollectionsOfficerID(5L))
                .thenReturn(List.of(openCase));

        List<DelinquencyCase> result = delinquencyService.getByOfficer(5L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAssignedCollectionsOfficerID()).isEqualTo(5L);
    }

    @Test
    @DisplayName("getByLoanAccount() - should return all cases for a loan account")
    void getByLoanAccount_filtered() {
        when(delinquencyRepository.findByLoanAccountID(1L)).thenReturn(List.of(openCase));

        List<DelinquencyCase> result = delinquencyService.getByLoanAccount(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getLoanAccountID()).isEqualTo(1L);
    }
}
