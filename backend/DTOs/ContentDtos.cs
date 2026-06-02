namespace Edu4Migration.Api.DTOs;

public record StatDto(string Value, string Label);
public record FocusAreaDto(string Title, string Body);
public record PartnerDto(string Name = "", string Country = "", string LogoUrl = "", string Role = "", string WebsiteUrl = "");

public record HomepageDto(
    string HeroEyebrow,
    string HeroEyebrowSq,
    string HeroTitle,
    string HeroTitleSq,
    string HeroSubtitle,
    string HeroSubtitleSq,
    string HeroBody,
    string HeroBodySq,
    string HeroImageUrl,
    List<StatDto> Stats,
    List<StatDto> StatsSq,
    List<FocusAreaDto> FocusAreas,
    List<FocusAreaDto> FocusAreasSq,
    List<PartnerDto> Partners);

public record ContentSectionDto(
    string Title,
    string Body,
    int SortOrder = 0,
    string DocumentTitle = "",
    string DocumentUrl = "",
    string TitleSq = "",
    string BodySq = "",
    string DocumentTitleSq = "");

public record ContentPageDto(
    string Slug,
    string Eyebrow,
    string Title,
    string Intro,
    List<ContentSectionDto> Sections,
    string EyebrowSq = "",
    string TitleSq = "",
    string IntroSq = "");
