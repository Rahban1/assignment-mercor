/**
 * Service for managing candidate operations like shortlisting and selection
 */

export interface CandidateAction {
  applicantId: string;
  action: 'shortlist' | 'remove_from_shortlist' | 'select';
  timestamp: Date;
}

export interface CandidateManagementCallbacks {
  onShortlist?: (applicantId: string) => void;
  onRemoveFromShortlist?: (applicantId: string) => void;
  onSelect?: (applicantId: string) => void;
}

/**
 * Manages candidate shortlisting and selection operations
 */
export class CandidateManagementService {
  private actionHistory: CandidateAction[] = [];

  /**
   * Handles toggling shortlist status for a candidate
   */
  toggleShortlist(
    applicantId: string, 
    isCurrentlyShortlisted: boolean, 
    callbacks: CandidateManagementCallbacks
  ): boolean {
    if (isCurrentlyShortlisted) {
      return this.removeFromShortlist(applicantId, callbacks);
    } else {
      return this.addToShortlist(applicantId, callbacks);
    }
  }

  /**
   * Adds candidate to shortlist
   */
  addToShortlist(applicantId: string, callbacks: CandidateManagementCallbacks): boolean {
    try {
      if (callbacks.onShortlist) {
        callbacks.onShortlist(applicantId);
        this.recordAction(applicantId, 'shortlist');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add candidate to shortlist:', error);
      return false;
    }
  }

  /**
   * Removes candidate from shortlist
   */
  removeFromShortlist(applicantId: string, callbacks: CandidateManagementCallbacks): boolean {
    try {
      if (callbacks.onRemoveFromShortlist) {
        callbacks.onRemoveFromShortlist(applicantId);
        this.recordAction(applicantId, 'remove_from_shortlist');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove candidate from shortlist:', error);
      return false;
    }
  }

  /**
   * Selects candidate for team
   */
  selectCandidate(applicantId: string, callbacks: CandidateManagementCallbacks): boolean {
    try {
      if (callbacks.onSelect) {
        callbacks.onSelect(applicantId);
        this.recordAction(applicantId, 'select');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to select candidate:', error);
      return false;
    }
  }

  /**
   * Gets candidate status for UI display
   */
  getCandidateStatusInfo(isShortlisted: boolean, isSelected: boolean): {
    canShortlist: boolean;
    canSelect: boolean;
    shortlistButtonText: string;
    shortlistIcon: 'star' | 'bookmark';
    selectButtonText: string;
  } {
    return {
      canShortlist: !isSelected,
      canSelect: isShortlisted && !isSelected,
      shortlistButtonText: isShortlisted ? "Remove from Shortlist" : "Add to Shortlist",
      shortlistIcon: isShortlisted ? 'star' : 'bookmark',
      selectButtonText: "Select for Team"
    };
  }

  /**
   * Records action in history for analytics/auditing
   */
  private recordAction(applicantId: string, action: CandidateAction['action']): void {
    this.actionHistory.push({
      applicantId,
      action,
      timestamp: new Date()
    });
  }

  /**
   * Gets action history for a specific candidate
   */
  getCandidateActionHistory(applicantId: string): CandidateAction[] {
    return this.actionHistory.filter(action => action.applicantId === applicantId);
  }

  /**
   * Gets all action history
   */
  getAllActionHistory(): CandidateAction[] {
    return [...this.actionHistory];
  }

  /**
   * Clears action history (useful for testing or reset)
   */
  clearActionHistory(): void {
    this.actionHistory = [];
  }
}

// Export singleton instance
export const candidateManagementService = new CandidateManagementService();