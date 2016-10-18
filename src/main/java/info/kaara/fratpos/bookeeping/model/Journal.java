package info.kaara.fratpos.bookeeping.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import info.kaara.fratpos.common.model.AuditableModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Journal extends AuditableModel {
	@ManyToOne
	private JournalType journalType;
	private LocalDate date;

	@OneToMany(mappedBy = "journal", cascade = CascadeType.ALL)
	private List<Posting> postings;

	@PrePersist
	private void validatePostings() {
		if (!isBalanced()) {
			throw new IllegalStateException("Journal is not balanced!");
		}
	}

	@JsonIgnore
	public boolean isBalanced() {
		Map<Boolean, BigDecimal> creditsAndDebits = postings.stream()
				.collect(Collectors.partitioningBy(Posting::getCredit)).entrySet().stream()
				.collect(Collectors.toMap(Map.Entry::getKey, v -> getPostingsSum(v.getValue())));
		return Objects.equals(creditsAndDebits.get(Boolean.FALSE), creditsAndDebits.get(Boolean.TRUE));
	}

	public BigDecimal getAmount() {
		return getPostingsSum(postings);
	}

	private BigDecimal getPostingsSum(List<Posting> postings) {
		return postings.stream().map(Posting::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
	}
}
