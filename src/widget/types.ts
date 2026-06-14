export interface PersonLink {
  label: string;
  url: string;
}

export interface InspiringPerson {
  name: string;
  quote: string;
  blurb: string;
  imageUrl: string;
  links: PersonLink[];
  tags: string[];
}
