import type { ReactNode } from 'react';

interface IContributor {
  firstName: string;
  lastName: string;
  alias: string;
  email: string;
  social: string;
}

var Contributors: { [id: string]: IContributor; } = {
  "reapazor": {
    firstName: "Matthew", lastName: "Davey",
    alias: "reapazor",
    email: "reapazor@gmail.com",
    social: "https://reapazor.com/"
  },
};


export default function ContributorLink({ id }): ReactNode {
  return (
    <a href={Contributors[id].social}>{`@${Contributors[id].alias}`}</a>
  )
}