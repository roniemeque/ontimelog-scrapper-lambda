import { query as q, Client } from "faunadb";
import { settings } from "../settings";

interface FaunaItem {
  ref: {
    value: {
      id: string;
    };
  };
  ts: any;
  data: {
    [key: string]: any;
  };
}

const client = new Client({
  secret: settings.FAUNA_KEY,
});

const transformFaunaResult = ({
  ref,
  ts,
  data,
}: FaunaItem): FaunaMappedItem => ({
  id: ref && ref.value && ref.value.id,
  ts,
  ...data,
});

export const allItemsByIndex = async (
  indexName: string
): Promise<FaunaMappedItem[] | null> => {
  try {
    const { data }: FaunaItem = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index(indexName))),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    );

    return data && data.map((item: FaunaItem) => transformFaunaResult(item));
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getItemById = async (
  collectionName: string,
  id: string
): Promise<FaunaMappedItem | null> => {
  try {
    const result: FaunaItem = await client.query(
      q.Get(q.Ref(q.Collection(collectionName), id))
    );

    return transformFaunaResult(result);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createItem = async (
  collectionName: string,
  dataToCreate: any
): Promise<FaunaMappedItem | null> => {
  try {
    const result: FaunaItem = await client.query(
      q.Create(q.Collection(collectionName), {
        data: { ...dataToCreate },
      })
    );

    return transformFaunaResult(result);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteById = async (
  collectionName: string,
  id: string
): Promise<any> => {
  try {
    const result: FaunaItem = await client.query(
      q.Delete(q.Ref(q.Collection(collectionName), id))
    );

    return transformFaunaResult(result);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const replaceById = async (
  collectionName: string,
  id: string,
  newData: any
): Promise<any> => {
  try {
    const result: FaunaItem = await client.query(
      q.Replace(q.Ref(q.Collection(collectionName), id), {
        data: {
          ...newData,
        },
      })
    );

    return transformFaunaResult(result);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateById = async (
  collectionName: string,
  id: string,
  newData: any
): Promise<any> => {
  try {
    const result: FaunaItem = await client.query(
      q.Update(q.Ref(q.Collection(collectionName), id), {
        data: {
          ...newData,
        },
      })
    );

    return transformFaunaResult(result);
  } catch (error) {
    console.error(error);
    return null;
  }
};
