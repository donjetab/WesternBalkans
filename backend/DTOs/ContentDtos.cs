namespace Edu4Migration.Api.DTOs;

public record StatDto(string Value, string Label);
public record FocusAreaDto(string Title, string Body);
public record PartnerDto(string Name, string Country, string LogoUrl);

public record HomepageDto(
    string HeroEyebrow,
    string HeroTitle,
    string HeroSubtitle,
    string HeroBody,
    string HeroImageUrl,
    List<StatDto> Stats,
    List<FocusAreaDto> FocusAreas,
    List<PartnerDto> Partners);

public record ContentSectionDto(string Title, string Body, int SortOrder = 0);
public record ContentPageDto(string Slug, string Eyebrow, string Title, string Intro, List<ContentSectionDto> Sections);
