import { useState, useEffect } from 'react';
import { EditablePage } from '@magnolia/react-editor';
import Basic from '../templates/pages/Basic';
import ReviewGrid from '../templates/components/ReviewGrid';
import MediaTypeData from '../templates/components/mediaType/MediaTypeData';
import MediaTypeList from '../templates/components/mediaType/MediaTypeList';
import RecommendationData from '../templates/components/recommendation/RecommendationData';
import Latest from '../templates/components/Latest';
import Hero from '../templates/components/Hero';

const nodeName = '/recommend';
const config = {
  componentMappings: {
    'recommend-lm:pages/basic': Basic,
    'recommend-lm:components/reviewgrid': ReviewGrid,
    'recommend-lm:components/mediaType/data': MediaTypeData,
    'recommend-lm:components/mediaType/list': MediaTypeList,
    'recommend-lm:components/recommendation/data': RecommendationData,
    'recommend-lm:components/hero': Hero,
    'recommend-lm:components/latest': Latest,
  },
};

// Use different defaultBaseUrl to point to public instances
const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
const pagesApi = defaultBaseUrl + '/delivery/pages/v1';
const templateAnnotationsApi = defaultBaseUrl + '/template-annotations/v1';

const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID
const H = {headers:{"X-subid-token": SUB_ID}};


export async function getServerSideProps(context) {
  console.log("page. gSSP Start. " + (new Date()).getSeconds())
  const isPagesApp = context.query?.mgnlPreview || null;
    let props = {
    isPagesApp,
    isPagesAppEdit: isPagesApp === 'false',
    pagePath: nodeName + context.resolvedUrl.replace(new RegExp('.*' + nodeName), ''), // Find out page path to fetch from Magnolia
  };
  global.mgnlInPageEditor = props.isPagesAppEdit;

  // Fetching page content
  const pagesRes = await fetch(pagesApi + props.pagePath + "?fd", H);
  props.page = await pagesRes.json();

  console.log("page. gSSP End." + (new Date()).getSeconds())

  return {
    props,
  };
}

export default function Pathname(props) {
  const [templateAnnotations, setTemplateAnnotations] = useState();
  const { isPagesApp, isPagesAppEdit, page, pagePath } = props;

  // Fetch template annotations only inside Magnolia WYSIWYG
  useEffect(() => {
    async function fetchTemplateAnnotations() {
      const templateAnnotationsRes = await fetch(templateAnnotationsApi + pagePath, H);
      const templateAnnotationsJson = await templateAnnotationsRes.json();

      setTemplateAnnotations(templateAnnotationsJson);
    }

    if (isPagesApp) fetchTemplateAnnotations();
  }, [isPagesApp, pagePath]);

  const shouldRenderEditablePage = page && (isPagesApp ? templateAnnotations : true);

  // In Pages app wait for template annotations before rendering EditablePage
  return (
    <>
      {shouldRenderEditablePage && (
        <EditablePage content={page} config={config} templateAnnotations={templateAnnotations} />
      )}
    </>
  );
}