type Image = {
  image: string;
};
type School = {
  id: number;
  name: string;
  color: string;
};
export type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  pronoun: string;
  programe: string;
  school: School;
  location: string;
  about: string;
  details: string[];
  interests: string[];
  profile_picture: string | null;
  images: Image[] | null;
  more_images: string[];
  bookmarks: number[];
  swipes: number;
};
