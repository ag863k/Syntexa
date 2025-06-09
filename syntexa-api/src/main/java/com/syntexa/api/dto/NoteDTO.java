package com.syntexa.api.dto;

public class NoteDTO {
    private Long id;
    private String approachTitle;
    private String content;
    private String language;
    private Long problemId;
    private String problemTitle;
    private String shareToken;
    private boolean isStarter;

    public NoteDTO() {}
    public NoteDTO(Long id, String approachTitle, String content, String language, Long problemId, String problemTitle, String shareToken, boolean isStarter) {
        this.id = id;
        this.approachTitle = approachTitle;
        this.content = content;
        this.language = language;
        this.problemId = problemId;
        this.problemTitle = problemTitle;
        this.shareToken = shareToken;
        this.isStarter = isStarter;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getApproachTitle() { return approachTitle; }
    public void setApproachTitle(String approachTitle) { this.approachTitle = approachTitle; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }
    public String getProblemTitle() { return problemTitle; }
    public void setProblemTitle(String problemTitle) { this.problemTitle = problemTitle; }
    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }
    public boolean isStarter() { return isStarter; }
    public void setStarter(boolean starter) { isStarter = starter; }
}
