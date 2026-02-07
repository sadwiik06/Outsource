package com.sadwiik.taskplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmMilestonesRequest {
    private List<Long> milestoneIds;  // IDs of milestones to confirm
}
