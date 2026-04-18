import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/code-persistence";

module {
  /// The persistent store: maps composite key "principal#language" -> CodeSnippet
  public type SnippetStore = Map.Map<Text, Types.CodeSnippet>;

  /// Build a composite map key from a principal and language.
  func makeKey(userId : Principal, language : Text) : Text {
    userId.toText() # "#" # language
  };

  /// Save or overwrite a code snippet for the given user and language.
  public func saveCode(
    store : SnippetStore,
    userId : Principal,
    language : Text,
    code : Text,
    savedAt : Int,
  ) {
    let key = makeKey(userId, language);
    let snippet : Types.CodeSnippet = { language; code; savedAt };
    store.add(key, snippet);
  };

  /// Load the saved code snippet for a user+language pair.
  public func loadCode(
    store : SnippetStore,
    userId : Principal,
    language : Text,
  ) : ?Types.CodeSnippet {
    let key = makeKey(userId, language);
    store.get(key);
  };

  /// List all languages a user has saved code for, as LanguageSummary array.
  public func listLanguages(
    store : SnippetStore,
    userId : Principal,
  ) : [Types.LanguageSummary] {
    let prefix = userId.toText() # "#";
    let summaries = store.entries()
      .filter(func((k, _v) : (Text, Types.CodeSnippet)) : Bool {
        k.startsWith(#text prefix)
      })
      .map(func((_k, v) : (Text, Types.CodeSnippet)) : Types.LanguageSummary {
        { language = v.language; savedAt = v.savedAt }
      });
    summaries.toArray();
  };

  /// Delete saved code for a user+language pair.
  public func deleteCode(
    store : SnippetStore,
    userId : Principal,
    language : Text,
  ) {
    let key = makeKey(userId, language);
    store.remove(key);
  };
};
