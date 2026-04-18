import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import CodePersistenceTypes "types/code-persistence";
import CodePersistenceApi "mixins/code-persistence-api";
import CodePersistenceLib "lib/code-persistence";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let snippetStore : CodePersistenceLib.SnippetStore = Map.empty<Text, CodePersistenceTypes.CodeSnippet>();

  include CodePersistenceApi(accessControlState, snippetStore);
};
