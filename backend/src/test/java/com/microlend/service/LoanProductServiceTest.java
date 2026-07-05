package com.microlend.service;

import com.microlend.dto.request.LoanProductRequest;
import com.microlend.entity.LoanProduct;
import com.microlend.enums.InterestType;
import com.microlend.enums.LoanProductCategory;
import com.microlend.enums.ProductStatus;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.LoanProductRepository;
import com.microlend.service.impl.LoanProductServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("LoanProductService Tests")
class LoanProductServiceTest {

    @Mock private LoanProductRepository productRepository;
    @InjectMocks private LoanProductServiceImpl loanProductService;

    private LoanProductRequest groupRequest;
    private LoanProduct groupProduct;

    @BeforeEach
    void setUp() {
        groupRequest = new LoanProductRequest();
        groupRequest.setProductName("Group Lending - Agriculture");
        groupRequest.setCategory(LoanProductCategory.GROUP_LENDING);
        groupRequest.setMinAmount(new BigDecimal("5000"));
        groupRequest.setMaxAmount(new BigDecimal("50000"));
        groupRequest.setTenureMonths(12);
        groupRequest.setInterestRatePercent(new BigDecimal("12.00"));
        groupRequest.setInterestType(InterestType.REDUCING);
        groupRequest.setProcessingFeePercent(new BigDecimal("2.00"));
        groupRequest.setStatus(ProductStatus.ACTIVE);

        groupProduct = LoanProduct.builder()
                .productID(1L)
                .productName("Group Lending - Agriculture")
                .category(LoanProductCategory.GROUP_LENDING)
                .minAmount(new BigDecimal("5000"))
                .maxAmount(new BigDecimal("50000"))
                .tenureMonths(12)
                .interestRatePercent(new BigDecimal("12.00"))
                .interestType(InterestType.REDUCING)
                .status(ProductStatus.ACTIVE)
                .build();
    }

    @Test
    @DisplayName("create() - should save product and return with ID")
    void create_success() {
        when(productRepository.save(any(LoanProduct.class))).thenReturn(groupProduct);

        LoanProduct result = loanProductService.create(groupRequest);

        assertThat(result.getProductID()).isEqualTo(1L);
        assertThat(result.getProductName()).isEqualTo("Group Lending - Agriculture");
        assertThat(result.getInterestType()).isEqualTo(InterestType.REDUCING);
        assertThat(result.getStatus()).isEqualTo(ProductStatus.ACTIVE);
        verify(productRepository).save(any(LoanProduct.class));
    }

    @Test
    @DisplayName("create() - should default to ACTIVE status when not provided")
    void create_defaultActiveStatus() {
        groupRequest.setStatus(null);
        when(productRepository.save(any(LoanProduct.class))).thenAnswer(inv -> {
            LoanProduct p = inv.getArgument(0);
            assertThat(p.getStatus()).isEqualTo(ProductStatus.ACTIVE);
            return groupProduct;
        });

        loanProductService.create(groupRequest);

        verify(productRepository).save(any());
    }

    @Test
    @DisplayName("create() - should correctly create FLAT interest type product")
    void create_flatInterestType() {
        groupRequest.setInterestType(InterestType.FLAT);
        LoanProduct flatProduct = LoanProduct.builder()
                .productID(2L).productName("Flat Product")
                .interestType(InterestType.FLAT).status(ProductStatus.ACTIVE).build();
        when(productRepository.save(any())).thenReturn(flatProduct);

        LoanProduct result = loanProductService.create(groupRequest);

        assertThat(result.getInterestType()).isEqualTo(InterestType.FLAT);
    }

    @Test
    @DisplayName("getAll() - should return all products")
    void getAll_returnsList() {
        LoanProduct p2 = LoanProduct.builder().productID(2L).productName("Individual Loan").build();
        when(productRepository.findAll()).thenReturn(List.of(groupProduct, p2));

        List<LoanProduct> result = loanProductService.getAll();

        assertThat(result).hasSize(2);
        assertThat(result).extracting(LoanProduct::getProductName)
                .contains("Group Lending - Agriculture", "Individual Loan");
    }

    @Test
    @DisplayName("getById() - should return product when found")
    void getById_found() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(groupProduct));

        LoanProduct result = loanProductService.getById(1L);

        assertThat(result.getProductID()).isEqualTo(1L);
        assertThat(result.getProductName()).isEqualTo("Group Lending - Agriculture");
    }

    @Test
    @DisplayName("getById() - should throw ResourceNotFoundException for unknown ID")
    void getById_notFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> loanProductService.getById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("999");
    }

    @Test
    @DisplayName("update() - should update rate and max amount")
    void update_success() {
        groupRequest.setInterestRatePercent(new BigDecimal("11.50"));
        groupRequest.setMaxAmount(new BigDecimal("60000"));
        when(productRepository.findById(1L)).thenReturn(Optional.of(groupProduct));
        when(productRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        LoanProduct result = loanProductService.update(1L, groupRequest);

        assertThat(result.getInterestRatePercent()).isEqualByComparingTo("11.50");
        assertThat(result.getMaxAmount()).isEqualByComparingTo("60000");
    }

    @Test
    @DisplayName("update() - should throw when product not found")
    void update_notFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> loanProductService.update(99L, groupRequest))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("discontinue() - should set status to DISCONTINUED")
    void discontinue_success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(groupProduct));
        when(productRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        loanProductService.discontinue(1L);

        verify(productRepository).save(argThat(p -> p.getStatus() == ProductStatus.DISCONTINUED));
    }

    @Test
    @DisplayName("discontinue() - should throw when product not found")
    void discontinue_notFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> loanProductService.discontinue(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
