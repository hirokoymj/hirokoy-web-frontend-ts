import { useQuery, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { SubmitHandler } from 'react-hook-form';

import { CREATE_TOPIC } from '../mutations/Topic';
import { CATEGORY_ALL } from '../queries/Category';
import { TOPIC_ALL } from '../queries/Topic';
import { SUB_CATEGORY_BY_CATEGORY } from '../queries/SubCategory';
import { makeDropdownOptions } from '../components/FormController/common';
import { TopicFormValues } from '../pages/type/types';

export const useTopicForm = (categoryId: string) => {
  const { enqueueSnackbar } = useSnackbar();

  // Create Topic
  const [createTopic] = useMutation(CREATE_TOPIC, {
    refetchQueries: [TOPIC_ALL],
  });
  //
  // Category Dropdown
  //
  const { data, loading } = useQuery(CATEGORY_ALL);
  const category_options = makeDropdownOptions(data, 'categoryAll', loading);
  //
  // SubCategory Dropdown
  //
  const { data: subCategoryData, loading: subCategoryLoading } = useQuery(SUB_CATEGORY_BY_CATEGORY, {
    variables: {
      categoryId: categoryId,
    },
  });

  // Make dropdown
  const subCategory_options = makeDropdownOptions(subCategoryData, 'subCategoryByCategory', subCategoryLoading);

  const onSubmit: SubmitHandler<TopicFormValues> = async (values) => {
    try {
      await createTopic({
        variables: {
          input: {
            ...values,
            order: values.order ? parseInt(values.order, 10) : undefined,
          },
        },
      });
      enqueueSnackbar('New topic has been created!', {
        variant: 'success',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const defaultValues = {
    category: '',
    subCategory: '',
    url: '',
    title: '',
    order: '', // <input type=number> type is number but string.
  };

  return {
    onSubmit,
    category_options,
    loading: loading || subCategoryLoading,
    defaultValues,
    subCategory_options,
  };
};
