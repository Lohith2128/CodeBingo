import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import CodePersistenceLib "../lib/code-persistence";
import Types "../types/code-persistence";

mixin (
  accessControlState : AccessControl.AccessControlState,
  snippetStore : CodePersistenceLib.SnippetStore,
) {
  /// Save or overwrite a code snippet for the authenticated caller.
  public shared ({ caller }) func saveCode(language : Text, code : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to save code");
    };
    CodePersistenceLib.saveCode(snippetStore, caller, language, code, Time.now());
  };

  /// Load saved code for the caller for a given language. Returns null if none saved.
  public query ({ caller }) func loadCode(language : Text) : async ?Types.CodeSnippet {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to load code");
    };
    CodePersistenceLib.loadCode(snippetStore, caller, language);
  };

  /// List all languages the caller has saved code for, with timestamps.
  public query ({ caller }) func listLanguages() : async [Types.LanguageSummary] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to list languages");
    };
    CodePersistenceLib.listLanguages(snippetStore, caller);
  };

  /// Delete saved code for the caller for a given language.
  public shared ({ caller }) func deleteCode(language : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to delete code");
    };
    CodePersistenceLib.deleteCode(snippetStore, caller, language);
  };
};
